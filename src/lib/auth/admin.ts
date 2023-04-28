import createHttpError from "http-errors"

export const adminOnlyMiddleware = (req, res, next) => {
  if (req.user.role === "Admin") {
    next()
  } else {
    next(createHttpError(403, "Admins only endpoint!"))
  }
}

export const superAdminOnlyMiddleware = (req, res, next) => {
  if (req.user.role === "SuperAdmin") {
    next()
  } else {
    next(createHttpError(403, "SuperAdmins only endpoint!"))
  }
}
