import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    getHello(): string {    
        return `Welcome from Wayventures's! Explore the world with us.`;
    }
}
