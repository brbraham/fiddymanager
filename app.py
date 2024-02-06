import random
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime, timedelta
import json

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///path/to/database.db'
db = SQLAlchemy(app)

class Hashword(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.String(20), nullable=False)
    concatenated_text = db.Column(db.Text, nullable=False)
    reminder_date = db.Column(db.String(20), nullable=False)

# Placeholder for the authenticated state
authenticated = False

@app.route('/')
def index():
    if authenticated:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    global authenticated
    password = request.form.get('password')
    
    if password == "your_password":
        authenticated = True
        return redirect(url_for('dashboard'))
    else:
        return render_template('index.html', error_message="Incorrect password. Please try again.")

@app.route('/dashboard')
def dashboard():
    if authenticated:
        # Generate Passphrase
        concatenated_text = generate_concatenated_text()

        # Calculate 180 days later from the current date
        reminder_date = datetime.now() + timedelta(days=180)

        # Format the reminder date as a string
        formatted_reminder_date = reminder_date.isoformat()

        # Create a Hashword object
        new_hashword = Hashword(
            timestamp=datetime.now().isoformat(),
            concatenated_text=concatenated_text,
            reminder_date=formatted_reminder_date
        )

        # Add and commit the new_hashword to the database
        db.session.add(new_hashword)
        db.session.commit()

        return render_template('dashboard.html', data=new_hashword)
    else:
        return redirect(url_for('index'))

def generate_concatenated_text():
    with open('passpull.txt', 'r') as file:
        all_lines = file.read()

    if all_lines.count('\n') >= 4:
        selected_lines = random.sample(all_lines.splitlines(), 4)
        concatenated_text = ''.join(selected_lines)
        timestamp = datetime.now()
        createdDate = datetime.now().strftime('%D')
        createTime = datetime.now().strftime('%T')
        reminder_date = datetime.now() + timedelta(days=180)

        data = {
            'timestamp': timestamp,
            'concatenated_text': concatenated_text,
            'reminder_date' : reminder_date
        }
        def custom_serializer(obj):
            if isinstance(obj, datetime):
                return obj.isoformat()
            raise TypeError("Type not serializable")
        with open('/Users/samanthabrown/Desktop/hashwords.txt', 'a') as output_file:
            json.dump(data, output_file, default=custom_serializer, indent=2)

        print(concatenated_text, ' generated on ', createdDate, ' at ', createTime)
        print('Reset your password on ', reminder_date.strftime('%D'))

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
