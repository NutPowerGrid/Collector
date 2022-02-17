import Nut from './nut';

const nut = new Nut();

nut.readInterval((data) => {
  console.log(data.ups.realpower)
});
