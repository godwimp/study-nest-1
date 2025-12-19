import { Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    Query
 } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, PaginationDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Get('paginated')
    findAllPaginated(@Query() paginationDto: PaginationDto) {
        return this.usersService.findAllPaginated(
            paginationDto.page,
            paginationDto.limit
        );
    }

    @Get('search')
    search(@Query('keyword') keyword: string) {
        return this.usersService.search(keyword);
    }

    @Get('filter-age')
    filterByAge(
        @Query('min') min: string,
        @Query('max') max: string
    ) {
        return this.usersService.filterByAge(+min, +max);
    }
}
