
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').del()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        { first_name: 'Xavier', last_name: 'Bueckert', school: 'Medicine Hat', grade: 9, arm_span: '', height: '6\'1\"', weight: '230', position:'OL', image: 'https://res.cloudinary.com/dhi1ngld5/image/upload/v1550717684/jexfgj5xmkm9ps1bjbwm.jpg', image_id: 'jexfgj5xmkm9ps1bjbwm'}, 
        { first_name: 'Tommy', last_name: 'Gordon', school: 'Medicine Hat', grade: 10, arm_span: '', height: '6\'5"', weight: '', position:'OL', image: 'https://res.cloudinary.com/dhi1ngld5/image/upload/v1550716525/puj478iqdxjtj83a9vtp.jpg', image_id: 'puj478iqdxjtj83a9vtp'}, 
        { first_name: 'Braydan', last_name: 'Clark', school: 'Red Deer', grade: 11, arm_span: '', height: '6\'1"', weight: '', position:'DE', image: 'https://res.cloudinary.com/dhi1ngld5/image/upload/v1550715646/xveqx624v1hph61bble6.jpg', image_id: 'xveqx624v1hph61bble6'}, 
        { first_name: 'Curtis', last_name: 'Myshaniuk', school: 'Stettler', grade: 11, arm_span: '', height: '6\'2"', weight: '280', position:'', image: 'https://res.cloudinary.com/dhi1ngld5/image/upload/v1550716011/ec0vymj63vnphrxwhmpm.jpg', image_id: 'ec0vymj63vnphrxwhmpm'}, 
        { first_name: 'Koby', last_name: 'Laychuk May', school: 'Medicine Hat', grade: 11, arm_span: '', height: '5\'9"', weight: '178', position:'RB', image: 'https://res.cloudinary.com/dhi1ngld5/image/upload/v1550716885/lbq7efiaxubzdxckw2jr.jpg', image_id: 'lbq7efiaxubzdxckw2jr'}, 
        { first_name: 'Haydyn', last_name: 'Davies', school: 'Medicine Hat', grade: 11, arm_span: '', height: '5\'8"', weight: '160', position:'WR', image: 'https://res.cloudinary.com/dhi1ngld5/image/upload/v1550717878/jrnmpzaldamfuyadfebk.jpg', image_id: 'jrnmpzaldamfuyadfebk'}, 
        { first_name: 'Carson', last_name: 'Taylor', school: 'Lethbridge', grade: 10, arm_span: '', height: '5\'6"', weight: '', position:'QB', image: 'https://res.cloudinary.com/dhi1ngld5/image/upload/v1550716551/rh8rw5lfqhymo1hlfhhr.jpg', image_id: 'rh8rw5lfqhymo1hlfhhr'}, 
        { first_name: '', last_name: '', school: '', grade: '', arm_span: '', height: '', weight: '', position:'', image: '', image_id: ''}, 
        
      ]);
    });
};
