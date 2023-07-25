from app import Resource
from flask import request
from .models import TaskPlanner, db
from datetime import datetime


class Helper:
    def date_finder(self, date):
        current_date = datetime.today()
        notebook_date = datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
        time_difference = (current_date - notebook_date).days
        if time_difference < 7:
            return f"{time_difference} Days ago"
        elif time_difference >= 7 or time_difference <= 30:
            return f"{(time_difference // 7)} Weeks ago"
        elif time_difference >= 31 or time_difference < 365:
            return f"{(time_difference // 30)} Months ago"
        elif time_difference >= 365:
            return f"{(time_difference // 365)} Years ago"
        else:
            return "Error"


helper = Helper()


class TaskPlannerView(Resource):
    def get(self):
        task_planner = TaskPlanner.query.all()
        temp = []
        for i in task_planner:
            temp.append(
                {
                    "id": i.id,
                    "title": i.title,
                    "content": i.content,
                    "date_created": helper.date_finder(i.date_created),
                }
            )
        return temp

    def post(self):
        data = request.get_json()
        title = str(data.get("title")).strip()
        content = str(data.get("description")).strip()
        print(len(title), len(content))
        if len(title) >= 5 and len(content) >= 10:
            add_task_planner = TaskPlanner(title, content)
            db.session.add(add_task_planner)
            db.session.commit()
            return {"status": "201"}
        return {"status": "400"}

    def put(self):
        data = request.get_json()
        key = data.get("key")
        task_planner = TaskPlanner.query.get(key)
        title = str(data.get("title")).strip()
        content = str(data.get("description")).strip()
        print(content)
        if (len(title) >= 5 and len(content) >= 10) and (
            task_planner.title != title or task_planner.content != content
        ):
            task_planner.title = title
            task_planner.content = content
            db.session.commit()
            return {"response": "successfuly make changes"}
        return {"response": "not make changes"}

    def delete(self):
        data = request.get_json()
        id = data.get("key")
        task_planner = TaskPlanner.query.get(id)
        if task_planner:
            db.session.delete(task_planner)
            db.session.commit()
            return {"status": "200"}
        return {"status": "400"}


class SearchTaskPlanner(Resource):
    def get(self):
        query = request.args.get("query")
        search_task_planner_title = TaskPlanner.query.filter(
            TaskPlanner.title.contains(query)
        )
        search_task_planner_content = TaskPlanner.query.filter(
            TaskPlanner.content.contains(query)
        )
        temp = []
        for i in search_task_planner_content:
            temp.append(
                {
                    "id": i.id,
                    "title": i.title,
                    "content": i.content,
                    "date_created": helper.date_finder(i.date_created),
                }
            )
        return temp
