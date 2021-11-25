import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Put, Req } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ClientProxy } from "@nestjs/microservices";
import { Authorization } from "../decorators/authorization.decorator";
import { IAuthorizedRequest } from "../interfaces/common/authorized-request.interface";
import { IServiceUserGetByIdResponse } from "../interfaces/user/service-user-get-by-id-response.interface";
import { firstValueFrom } from "rxjs";
import { CreateUserResponseDto } from "../interfaces/user/dto/create-user-response.dto";
import { CreateUserDto } from "../interfaces/user/dto/create-user.dto";
import { IServiceUserCreateResponse } from "../interfaces/user/service-user-create-response.interface";
import { LoginUserResponseDto } from "../interfaces/user/dto/login-user-response.dto";
import { LoginUserDto } from "../interfaces/user/dto/login-user.dto";
import { IServiceUserSearchResponse } from "../interfaces/user/service-user-search-response.interface";
import { LogoutUserResponseDto } from "../interfaces/user/dto/logout-user-response.dto";
import { IServiceTokenDestroyResponse } from "../interfaces/token/service-token-destroy-response.interface";
import { ConfirmUserResponseDto } from "../interfaces/user/dto/confirm-user-response.dto";
import { ConfirmUserDto } from "../interfaces/user/dto/confirm-user.dto";
import { IServiceUserConfirmResponse } from "../interfaces/user/service-user-confirm-response.interface";
import { UserIdDto } from "../interfaces/user/dto/user-id.dto";
import { GetUserByIdResponseDto } from "../interfaces/user/dto/get-user-by-id-response.dto";
import { TOKEN_SERVICE, USER_SERVICE, user_create, user_get_by_id } from "@project/constants";

@Controller("users")
@ApiTags("users")
export class UserController {
  constructor(
    @Inject(TOKEN_SERVICE) private readonly tokenServiceClient: ClientProxy,
    @Inject(USER_SERVICE) private readonly userServiceClient: ClientProxy
  ) {
  }

  @Get(":id")
  @Authorization(false)
  @ApiOkResponse({ type: GetUserByIdResponseDto })
  public async getById(
    @Param() { id }: UserIdDto
  ): Promise<GetUserByIdResponseDto> {
    const userResponse: IServiceUserGetByIdResponse = await firstValueFrom(
      this.userServiceClient.send(user_get_by_id, id)
    );

    if (userResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: userResponse.message,
          data: null,
          errors: userResponse.errors
        },
        userResponse.status
      );
    }

    return {
      status: userResponse.status,
      message: userResponse.message,
      data: { user: userResponse.user },
      errors: null
    };
  }

  @Post()
  @ApiCreatedResponse({ type: CreateUserResponseDto })
  public async createUser(
    @Body() userRequest: CreateUserDto
  ): Promise<CreateUserResponseDto> {
    const createUserResponse: IServiceUserCreateResponse = await firstValueFrom(
      this.userServiceClient.send(user_create, userRequest)
    );

    if (createUserResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createUserResponse.message,
          data: null,
          errors: createUserResponse.errors
        },
        createUserResponse.status
      );
    }

    // const createTokenResponse: IServiceTokenCreateResponse = await firstValueFrom(
    //   this.tokenServiceClient.send('token_create', {
    //     userId: createUserResponse.user.id,
    //   }),
    // );

    return {
      status: HttpStatus.CREATED,
      message: createUserResponse.message,
      data: {
        user: createUserResponse.user,
        // token: createTokenResponse.token,
        token: "no generate token yet"
      },
      errors: null
    };
  }

  @Post("/login")
  @ApiCreatedResponse({ type: LoginUserResponseDto })
  public async loginUser(
    @Body() loginRequest: LoginUserDto
  ): Promise<LoginUserResponseDto> {
    const getUserResponse: IServiceUserSearchResponse = await firstValueFrom(
      this.userServiceClient.send("user_search_by_credentials", loginRequest)
    );
    if (getUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: getUserResponse.message,
          data: null,
          errors: null
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    return { message: "", data: null, errors: null };
  }

  @Put("/logout")
  @Authorization(true)
  @ApiCreatedResponse({ type: LogoutUserResponseDto })
  public async logoutUser(
    @Req() request: IAuthorizedRequest
  ): Promise<LogoutUserResponseDto> {
    const userInfo = request.user;

    const destroyTokenResponse: IServiceTokenDestroyResponse = await firstValueFrom(
      this.tokenServiceClient.send("token_destroy", { userId: userInfo.id })
    );

    if (destroyTokenResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: destroyTokenResponse.message,
          data: null,
          errors: destroyTokenResponse.errors
        },
        destroyTokenResponse.status
      );
    }

    return { message: destroyTokenResponse.message, errors: null, data: null };
  }

  @Get("/confirm/:link")
  @ApiCreatedResponse({ type: ConfirmUserResponseDto })
  public async confirmUser(
    @Param() params: ConfirmUserDto
  ): Promise<ConfirmUserResponseDto> {
    const confirmUserResponse: IServiceUserConfirmResponse = await firstValueFrom(
      this.userServiceClient.send("user_confirm", { link: params.link })
    );

    if (confirmUserResponse.status !== HttpStatus.OK) {
      throw new HttpException(
        {
          message: confirmUserResponse.message,
          data: null,
          errors: confirmUserResponse.errors
        },
        confirmUserResponse.status
      );
    }

    return { message: confirmUserResponse.message, data: null, errors: null };
  }
}
