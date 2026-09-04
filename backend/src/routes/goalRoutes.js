const express = require('express');
const router = express.Router();
const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  contributeToGoal,
  deleteGoal,
} = require('../controllers/goalController');

/**
 * GOAL ROUTES
 *
 * POST   /api/goals                      Create goal
 * GET    /api/goals/:userId              List goals for user
 * GET    /api/goals/item/:goalId         Get one goal
 * PATCH  /api/goals/:goalId              Update goal fields
 * POST   /api/goals/:goalId/contribute   Add progress (default ₹500)
 * DELETE /api/goals/:goalId              Delete goal
 */

router.post('/', createGoal);
router.get('/item/:goalId', getGoalById);
router.post('/:goalId/contribute', contributeToGoal);
router.patch('/:goalId', updateGoal);
router.delete('/:goalId', deleteGoal);
router.get('/:userId', getGoals);

module.exports = router;
