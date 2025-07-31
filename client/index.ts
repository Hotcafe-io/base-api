// Auto-generated API client
import axios from "axios";
import * as utils from "./types";

class ApiServiceClass {
  private axiosInstance = axios.create({ baseURL: process.env.API_BASE_URL ?? "" });

  public readonly v1 = {
    base: {
      route: {
        postFn: async (data: utils.v1_base_route_postReqSchemaType): Promise<utils.v1_base_route_postResSchemaType> => {
          const res = await this.axiosInstance.post("/api/v1/base/route", data);
          return utils.v1_base_route_postResSchema.parse(res.data);
        },
        getFn: async (params: utils.v1_base_route_getReqSchemaType): Promise<utils.v1_base_route_getResSchemaType> => {
          const res = await this.axiosInstance.get("/api/v1/base/route", { params });
          return utils.v1_base_route_getResSchema.parse(res.data);
        },
        putFn: async (data: utils.v1_base_route_putReqSchemaType): Promise<utils.v1_base_route_putResSchemaType> => {
          const res = await this.axiosInstance.put("/api/v1/base/route", data);
          return utils.v1_base_route_putResSchema.parse(res.data);
        },
        deleteBaseData: async (params: utils.v1_base_route_deleteReqSchemaType): Promise<utils.v1_base_route_deleteResSchemaType> => {
          const res = await this.axiosInstance.delete("/api/v1/base/route", { params });
          return utils.v1_base_route_deleteResSchema.parse(res.data);
        },
        patchFn: async (data: utils.v1_base_route_patchReqSchemaType): Promise<utils.v1_base_route_patchResSchemaType> => {
          const res = await this.axiosInstance.patch("/api/v1/base/route", data);
          return utils.v1_base_route_patchResSchema.parse(res.data);
        },
      },
    },
    user: {
      login: {
        postLogin: async (data: utils.v1_user_login_postReqSchemaType): Promise<utils.v1_user_login_postResSchemaType> => {
          const res = await this.axiosInstance.post("/api/v1/user/login", data);
          return utils.v1_user_login_postResSchema.parse(res.data);
        },
      },
      logout: {
        postLogout: async (data: utils.v1_user_logout_postReqSchemaType): Promise<utils.v1_user_logout_postResSchemaType> => {
          const res = await this.axiosInstance.post("/api/v1/user/logout", data);
          return utils.v1_user_logout_postResSchema.parse(res.data);
        },
      },
    },
  };
}

export const ApiService = new ApiServiceClass();