from app import api
from .views import TaskPlannerView, SearchTaskPlanner


api.add_resource(TaskPlannerView, "/task-planner")
api.add_resource(SearchTaskPlanner, "/task-planner/search/")
