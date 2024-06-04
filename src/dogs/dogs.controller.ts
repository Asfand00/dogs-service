import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, NotFoundException } from '@nestjs/common';

interface Dog {
    id: number;
    name: string;
    age: number;
}

@Controller('dogs')
export class DogsController {
    private dogs: Dog[] = [
        { id: 1, name: 'Rex', age: 4 },
        { id: 2, name: 'Buddy', age: 7 },
    ];

    @Get()
    getAllDogs(): Dog[] {
        return this.dogs;
    }

    @Get(':id')
    getDogById(@Param('id') id: number): Dog {
        const dog = this.dogs.find(dog => dog.id === +id);
        if (!dog) {
            throw new NotFoundException(`Dog with ID ${id} not found`);
        }
        return dog;
    }

    @Post()
    @HttpCode(201)
    createDog(@Body() newDog: Dog): Dog {
        this.dogs.push(newDog);
        return newDog;  // In real application, you should validate and sanitize input data
    }

    @Put(':id')
    updateDog(@Param('id') id: number, @Body() updateDogDto: Dog): Dog {
        let dog = this.dogs.find(dog => dog.id === +id);
        if (!dog) {
            throw new NotFoundException(`Dog with ID ${id} not found`);
        }
        dog = { ...dog, ...updateDogDto };
        this.dogs = this.dogs.map(d => d.id === +id ? dog : d);
        return dog;
    }

    @Delete(':id')
    deleteDog(@Param('id') id: number): { deleted: boolean, message: string } {
        const index = this.dogs.findIndex(dog => dog.id === +id);
        if (index === -1) {
            throw new NotFoundException(`Dog with ID ${id} not found`);
        }
        this.dogs.splice(index, 1);
        return { deleted: true, message: `Dog with ID ${id} successfully deleted` };
    }
}
