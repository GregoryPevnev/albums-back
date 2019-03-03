exports.up = function(knex, Promise) {
    return knex.schema.createTable("likes", builder => {
        builder
            .string("album")
            .references("id")
            .inTable("albums")
            .onDelete("CASCADE");
        builder
            .string("user")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        builder.primary("album", "user");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("likes");
};
