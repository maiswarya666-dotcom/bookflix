from flask import Flask, render_template, request
import json

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():

    with open("books.json", "r") as file:
        books = json.load(file)

    if request.method == "POST":

    genre = request.form["genre"].lower()

    minutes = int(request.form["minutes"])

    filtered_books = []

    for book in books:

        if (
            genre in book["genre"].lower()
            and
            book["minutes"] <= minutes
        ):
            filtered_books.append(book)

    books = filtered_books

    return render_template(
        "index.html",
        books=books
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)