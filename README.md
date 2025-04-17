# LucaStars Webshop

This project was developed as part of the Software Engineering course (Block 4, 2023–2024) at the Amsterdam University of Applied Sciences.

LucaStars is a fictional game developer that previously released several text-based adventure games. Due to their popularity, the marketing team in collaboration with CEO Bert Rongil, decided to launch a webshop to sell these games and related merchandise.

## What We Built

A complete webshop where:
- All previously developed games from Block 3 are listed
- Each game includes related merchandise (hoodies, T-shirts, mugs, etc.)
- Users can browse products, add items to their cart, and place orders

## Technologies Used

| Technology     | Description                                                             |
|----------------|-------------------------------------------------------------------------|
| **Lit**         | For building reusable Web Components in the frontend                   |
| **HTML/CSS**    | Used for styling and layout of components                              |
| **TypeScript**  | Strongly typed language used in both frontend and backend              |
| **Node.js**     | Runtime environment for backend logic                                  |
| **Express.js**  | Framework for building RESTful APIs                                    |
| **Fetch API**   | To handle communication between frontend and backend                   |
| **MySQL**       | Relational database for storing games, merchandise, and orders         |

## Project Structure

- `frontend/` – Lit-based Web Components
- `backend/` – Node.js & Express API
- `database/` – MySQL schema and scripts
- `docs/` – Technical documentation and game data (CSV)
- `public/` – Static assets (images, CSS)

## Key Features

- Game overview and detail pages
- Merchandise section per game
- Shopping cart and order form
- Form validation
- Orders saved to a MySQL database

## Additional Components

- Self-developed class diagram based on project analysis
- Integrated unit testing (frontend and backend)
- Contextual research report included in the documentation

## Learning Objectives

- Independently translating a class diagram into working code
- Integrating frontend, backend, and database systems
- Working with a team using the SCRUM methodology
- Writing and running tests (unit & integration)
- Conducting research within a technical project context

## Game Data (CSV)

The `docs/games.csv` file contains all information about the available games and is imported into the MySQL database during setup.
