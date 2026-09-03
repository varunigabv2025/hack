const Goal = require('../models/Goal');
const User = require('../models/User');

/**
 * GOAL CONTROLLER
 * Clear CRUD + contribute for savings goals.
 * Deterministic only — no AI.
 */

const generateGoalId = () =>
  `GOAL${Date.now()}${Math.random().toString(36).slice(2, 9).toUpperCase()}`;

function toPublicGoal(goal) {
  const target = Number(goal.target) || 0;
  const current = Number(goal.current) || 0;
  const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  return {
    goal_id: goal.goal_id,
    id: goal.goal_id,
    user_id: goal.user_id,
    name: goal.name,
    target,
    current,
    icon: goal.icon || '🎯',
    status: goal.status,
    progress,
    remaining: Math.max(0, target - current),
    created_at: goal.created_at,
    updated_at: goal.updated_at,
  };
}

async function requireUser(userId) {
  const user = await User.findOne({ user_id: userId });
  if (!user) {
    const error = new Error('User not found. Create a profile first using POST /api/profile');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return user;
}

/**
 * POST /api/goals
 * Body: { user_id, name, target, icon?, current? }
 */
const createGoal = async (req, res, next) => {
  try {
    const { user_id, name, target, icon, current } = req.body;

    if (!user_id) {
      const error = new Error('Missing required field: user_id');
      error.statusCode = 400;
      error.code = 'MISSING_USER_ID';
      throw error;
    }
    if (!name || !String(name).trim()) {
      const error = new Error('Missing required field: name');
      error.statusCode = 400;
      error.code = 'MISSING_NAME';
      throw error;
    }
    if (target === undefined || target === null) {
      const error = new Error('Missing required field: target');
      error.statusCode = 400;
      error.code = 'MISSING_TARGET';
      throw error;
    }

    const targetNum = Number(target);
    const currentNum = current === undefined || current === null ? 0 : Number(current);

    if (!Number.isFinite(targetNum) || targetNum < 1) {
      const error = new Error('Target must be a number of at least 1');
      error.statusCode = 400;
      error.code = 'INVALID_TARGET';
      throw error;
    }
    if (!Number.isFinite(currentNum) || currentNum < 0) {
      const error = new Error('Current amount must be a non-negative number');
      error.statusCode = 400;
      error.code = 'INVALID_CURRENT';
      throw error;
    }

    await requireUser(user_id);

    const goal = await Goal.create({
      goal_id: generateGoalId(),
      user_id,
      name: String(name).trim(),
      target: targetNum,
      current: Math.min(currentNum, targetNum),
      icon: icon || '🎯',
      status: currentNum >= targetNum ? 'completed' : 'active',
    });

    res.status(201).json({
      success: true,
      goal: toPublicGoal(goal),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/goals/:userId
 * Query: status=active|completed|archived|all (default active+completed)
 */
const getGoals = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const status = req.query.status || 'open';

    await requireUser(userId);

    const query = { user_id: userId };
    if (status === 'all') {
      /* no status filter */
    } else if (status === 'open') {
      query.status = { $in: ['active', 'completed'] };
    } else {
      query.status = status;
    }

    const goals = await Goal.find(query).sort({ created_at: -1 }).lean();
    const publicGoals = goals.map(toPublicGoal);

    const summary = {
      goal_count: publicGoals.length,
      active_count: publicGoals.filter((g) => g.status === 'active').length,
      completed_count: publicGoals.filter((g) => g.status === 'completed').length,
      total_target: publicGoals.reduce((sum, g) => sum + g.target, 0),
      total_saved: publicGoals.reduce((sum, g) => sum + g.current, 0),
    };

    res.json({
      success: true,
      goals: publicGoals,
      count: publicGoals.length,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/goals/item/:goalId
 */
const getGoalById = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const goal = await Goal.findOne({ goal_id: goalId });
    if (!goal) {
      const error = new Error('Goal not found');
      error.statusCode = 404;
      error.code = 'GOAL_NOT_FOUND';
      throw error;
    }
    res.json({ success: true, goal: toPublicGoal(goal) });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/goals/:goalId
 * Body: { name?, target?, icon?, status? }
 */
const updateGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const { name, target, icon, status } = req.body;

    const goal = await Goal.findOne({ goal_id: goalId });
    if (!goal) {
      const error = new Error('Goal not found');
      error.statusCode = 404;
      error.code = 'GOAL_NOT_FOUND';
      throw error;
    }

    if (name !== undefined) {
      if (!String(name).trim()) {
        const error = new Error('Name cannot be empty');
        error.statusCode = 400;
        error.code = 'INVALID_NAME';
        throw error;
      }
      goal.name = String(name).trim();
    }

    if (target !== undefined) {
      const targetNum = Number(target);
      if (!Number.isFinite(targetNum) || targetNum < 1) {
        const error = new Error('Target must be a number of at least 1');
        error.statusCode = 400;
        error.code = 'INVALID_TARGET';
        throw error;
      }
      goal.target = targetNum;
      if (goal.current > goal.target) goal.current = goal.target;
    }

    if (icon !== undefined) goal.icon = icon || '🎯';

    if (status !== undefined) {
      if (!['active', 'completed', 'archived'].includes(status)) {
        const error = new Error('Invalid status. Use active, completed, or archived');
        error.statusCode = 400;
        error.code = 'INVALID_STATUS';
        throw error;
      }
      goal.status = status;
    }

    if (goal.current >= goal.target && goal.status === 'active') {
      goal.status = 'completed';
      goal.current = goal.target;
    }

    goal.updated_at = new Date();
    await goal.save();

    res.json({ success: true, goal: toPublicGoal(goal) });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/goals/:goalId/contribute
 * Body: { amount? } — defaults to 500
 */
const contributeToGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const amountRaw = req.body?.amount;
    const amount = amountRaw === undefined || amountRaw === null ? 500 : Number(amountRaw);

    if (!Number.isFinite(amount) || amount <= 0) {
      const error = new Error('Contribution amount must be a positive number');
      error.statusCode = 400;
      error.code = 'INVALID_AMOUNT';
      throw error;
    }

    const goal = await Goal.findOne({ goal_id: goalId });
    if (!goal) {
      const error = new Error('Goal not found');
      error.statusCode = 404;
      error.code = 'GOAL_NOT_FOUND';
      throw error;
    }

    if (goal.status === 'archived') {
      const error = new Error('Cannot contribute to an archived goal');
      error.statusCode = 400;
      error.code = 'GOAL_ARCHIVED';
      throw error;
    }

    const before = goal.current;
    goal.current = Math.min(goal.target, goal.current + amount);
    if (goal.current >= goal.target) {
      goal.status = 'completed';
      goal.current = goal.target;
    } else if (goal.status === 'completed' && goal.current < goal.target) {
      goal.status = 'active';
    }
    goal.updated_at = new Date();
    await goal.save();

    res.json({
      success: true,
      contributed: goal.current - before,
      goal: toPublicGoal(goal),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/goals/:goalId
 */
const deleteGoal = async (req, res, next) => {
  try {
    const { goalId } = req.params;
    const goal = await Goal.findOneAndDelete({ goal_id: goalId });
    if (!goal) {
      const error = new Error('Goal not found');
      error.statusCode = 404;
      error.code = 'GOAL_NOT_FOUND';
      throw error;
    }
    res.json({
      success: true,
      deleted: true,
      goal_id: goalId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  contributeToGoal,
  deleteGoal,
  toPublicGoal,
};
