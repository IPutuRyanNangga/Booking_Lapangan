from locust import HttpUser, task, between

class LaravelUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def login(self):
        self.client.post("/api/login", json={
            "email": "test@gmail.com",
            "password": "password"
        })