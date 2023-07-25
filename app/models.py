from app import db
from datetime import datetime


class TaskPlanner(db.Model):
    __tablename__ = "task_planner"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_created = db.Column(
        db.String, nullable=False, default=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )

    def __init__(self, title, content):
        self.title = title
        self.content = content

    def __repr__(self):
        return f"TaskPlanner('{self.title}', '{self.content}')"
