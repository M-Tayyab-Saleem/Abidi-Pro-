class ExpressError extends Error {
    constructor(status, message){
        super();
        this.status = status;
        this.message = message;
    }
};


class NotFoundError extends ExpressError {
  constructor(resource = "Resource") {
    super(404, `${resource} not found`);
  }
}

class BadRequestError extends ExpressError {
    constructor(message = "Bad Request") {
      super(400, message);
    }
  }


  module.exports = {
    ExpressError,
    NotFoundError,
    BadRequestError,
  };