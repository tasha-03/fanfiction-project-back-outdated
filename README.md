# fanfiction-project
To launch the project:
1. Clone the repository;
2. ```npm install```
3. Create ```.env``` file with environmental variables:
        DB_CUSTOM_HOST="" // string
	    DB_CUSTOM_PORT= // integer
	    DB_CUSTOM_USER="" // string
	    DB_CUSTOM_PASSWORD="" // string
	    DB_CUSTOM_DATABASE="" // string
4. Launch the migration ```knex migrate:up```;
5. Run the seed if you want to fill the db with data ```knex seed:run.```