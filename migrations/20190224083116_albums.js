exports.up = function(knex, Promise) {
    const albumPromise = knex.schema.createTable("albums", builder => {
        builder.string("id").primary("primary_string_albums");
        builder.string("title").notNullable(); // Allow repeating album-names (DUH)
        builder.string("artist").notNullable();
        builder
            .string("user")
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .index("user_albums_fk");
        builder.timestamp("added").notNullable();
    });

    const songPromise = knex.schema.createTable("songs", builder => {
        builder.string("id").primary("primary_string_songs");
        builder.string("name").notNullable();
        builder.integer("order").notNullable();
        builder.string("object").notNullable();
        builder
            .string("album")
            .notNullable()
            .references("id")
            .inTable("albums")
            .onDelete("CASCADE")
            .index("album_songs_fk");
    });

    return Promise.all([albumPromise, songPromise]);
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("songs").then(() => knex.schema.dropTable("albums"));
};
