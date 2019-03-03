exports.up = function(knex, Promise) {
    return knex.schema.alterTable("albums", builder => {
        builder.string("image").nullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable("albums", builder => {
        builder.dropColumn("image");
    });
};
