// // import dbConnection from "../../lib/dbConnection";

import errorHandler from "../ErrorHandelars";

// import errorHandler from "../ErrorHandelars";

// const catchAsync =
//   (handler: (req: Request, res?: Response) => void) =>
//   async (req: Request, res: Response) => {
//     try {
//       //   await dbConnection();
//       return await handler(req, res);
//     } catch (error) {
//       return errorHandler(error as Error);
//     }
//   };

// export default catchAsync;

export function catchAsync<T>(handler: (req: Request) => Promise<T>) {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      return errorHandler(error as Error);
    }
  };
}
