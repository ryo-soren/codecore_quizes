const faker = require('faker')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  return knex('clucks')
  .del()
  .then(() => {
    const clucks = []

    for (let i = 0; i < 30; i++) {
      clucks.push({
        username: faker.name.firstName(),
        image_url: faker.image.abstract(640, 480, true),
        content: faker.lorem.paragraph(),
      })
    }
    return knex('clucks').insert(clucks)
  })
  
};