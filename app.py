from flask import Flask, render_template, request
import json

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():

    with open("books.json", "r", encoding="utf-8") as file:
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

    books.sort(key=lambda book: book["minutes"])

    for book in books:

        if book["minutes"] >= 60:

            hours = round(book["minutes"] / 60, 1)

            book["display_time"] = f"{hours} hours"

        else:

            book["display_time"] = f"{book['minutes']} minutes"

    return render_template(
        "index.html",
        books=books,
        no_books=(len(books) == 0),
        book_count=len(books)
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)