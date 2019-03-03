exports.up = function(knex, Promise) {
    return knex.schema.createTable("users", builder => {
        builder.string("id").primary("primary_string_id");
        builder
            .string("username")
            .notNullable()
            .index()
            .unique("username_unique");
        builder
            .string("email")
            .notNullable()
            .index()
            .unique("email_unique");
        builder.string("password").notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("users");
};
