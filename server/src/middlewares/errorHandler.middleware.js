module.exports=(err, req, res, next) => {
    console.error(err.stack);
  
    // Set Content-Type to application/json
    res.setHeader('Content-Type', 'application/json');
  
    // Respond with the custom error details
    res.status(err.statusCode || 500).json({
      success: false,
      error: {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
        date: err.date,
      },
    });
  }