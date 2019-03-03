exports.up = function(knex, Promise) {
    return knex.schema.createTable("reviews", builder => {
        builder.string("id").primary();
        builder.string("title").notNullable();
        builder.string("text").defaultTo("");
        builder.integer("rating").notNullable();
        builder
            .string("album")
            .references("id")
            .inTable("albums")
            .onDelete("CASCADE")
            .index("albums_review_fk");
        builder
            .string("user")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .index("users_review_fk");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("reviews");
};
