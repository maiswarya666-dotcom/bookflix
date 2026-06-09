from flask import Flask, render_template, request
import json

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():

    with open("books.json", "r") as file:
        books = json.load(file)

    if request.method == "POST":

        search = request.form["search"].lower()

        filtered_books = []

        for book in books:

            if search in book["genre"].lower():
                filtered_books.append(book)

        books = filtered_books

    return render_template(
        "index.html",
        books=books
    )

if __name__ == "__main__":
    app.run(debug=True)