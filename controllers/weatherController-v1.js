const Weather = require('../models/weatherModel');

exports.getAllWeather = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    // 遍历这个数组，如果req.query 这个对象中包含这些element的属性名，则删除这些el
    excludeFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Weather.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' '); // -price -ratingsAverage

      query = query.sort(sortBy);
      // sort('price ratingsAverage')
    } else {
      query = query.sort('-createAt');
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields); // 'name duration price'
    } else {
      // excluding this field, this field is created internally by mongoDB, we don't want to send it to the client
      query = query.select('-__v');
    }

    // 4) Pagination
    // convert the string to number and Display page 1 by default, 100 results by default
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // page=2&limit=10, 1-10, page1; 11-20, page 2; 21-30, page 3; ....

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numWeather = await Weather.countDocuments();
      if (skip >= numWeather) throw new Error('This page does not exist');
      // This error will be catch in the catch block
    }

    // EXECUTE QUERY
    const weather = await query;

    // Return a promise
    // const weather= await Weather.find();

    res.status(200).json({
      // formatting the json to Jsend
      status: 'success',
      results: weather.length,
      data: {
        weather,
        // in ES6, if the key and value have the same name, we can write tours
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getWeather = async (req, res) => {
  try {
    const id = req.params.id.trim();
    const weather = await Weather.findById(id);

    res.status(200).json({
      status: 'success',
      data: {
        weather,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createWeather = async (req, res) => {
  try {
    const newWeather = await Weather.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        weather: newWeather,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

// exports.createWeather = (req, res) => {
//   res.statue(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };

exports.updateWeather = async (req, res) => {
  try {
    const weather = await Weather.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: {
        weather,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteWeather = async (req, res) => {
  try {
    // Do not send back any data to the client when there was a delete operation
    await Weather.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err,
    });
  }
};
