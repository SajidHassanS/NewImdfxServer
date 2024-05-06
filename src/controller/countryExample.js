

// ==================== get ethnicity record ====================//
const getCountry = catchAsync(async (req, res) => {
    const data = JSON.parse(req.params.query);
    let limit = data.limit || 10;
    let condition = {};
  
    if (data.name) {
      condition = {
        $expr: {
          $regexMatch: {
            input: {
              $concat: ["$countryName", { $toString: "$countryId" }],
            },
            regex: `.*${data.name}.*`,
            options: "i",
          },
        },
      };
    }
    const Record = await fetchCountryList(condition, {});
    // Formatting Data For Pagination
    let dataObj = {};
    const tableDataRecord = Record[0].tableData;
    if (tableDataRecord && tableDataRecord.length > 0) {
      let metaData = Record[0].total;
      dataObj = {
        page: parseInt(parseInt(metaData[0].total) / limit),
      };
    }
    Record[0].page = dataObj.page;
    // Check if variable Total in record has no length then assign 0
    if (Record[0].total.length == 0) {
      Record[0].total[0] = {
        total: 0,
      };
    }
    Record[0].total = Record[0].total[0].total;
  
    res.send({
      status: constant.SUCCESS,
      Category: "Record fetch Successfully",
      Record: Record[0],
    });
  });
  
  // ==================== add country record ====================//
  const addCountry = catchAsync(async (req, res) => {
    const data = req.body;
    const isExist = await generalService.getRecord(TableName, {
      countryName: data.countryName,
    });
    if (isExist && isExist.length > 0) {
      throw new AppError("Country already exists with the same name", 409);
    } else {
      data.createdBy = req.user._id;
      data[incrementalId] = await autoIncrement(TableName, incrementalId);
      const Record = await generalService.addRecord(TableName, data);
      const countryRecord = await generalService.getRecordAggregateWithSpecific(
        TableName,
        { _id: 1, countryName: 1 },
        { countryName: 1 }
      );
      await client.set(cacheKey, JSON.stringify(countryRecord));
      const AllRecord = await fetchCountryList({ _id: Record._id }, {});
      res.send({
        status: constant.SUCCESS,
        message: "Record added successfully",
        Record: AllRecord[0],
      });
    }
  });
  
  // ==================== update country record ====================//
  const updateCountry = catchAsync(async (req, res) => {
    const data = req.body;
    const isExist = await generalService.getRecord(TableName, {
      countryName: data.countryName,
    });
    if (isExist && isExist.length > 0) {
      res.send({
        status: constant.ERROR,
        message: "Country already exists with the same name",
      });
    } else {
      const Record = await generalService.findAndModifyRecord(
        TableName,
        {
          _id: data._id,
        },
        data
      );
      const countryRecord = await generalService.getRecordAggregateWithSpecific(
        TableName,
        { _id: 1, countryName: 1 },
        { countryName: 1 }
      );
      await client.set(cacheKey, JSON.stringify(countryRecord));
      const updatedRecord = await fetchCountryList({ _id: Record._id }, {});
      res.send({
        status: constant.SUCCESS,
        message: "Record updated successfully",
        Record: updatedRecord[0],
      });
    }
  });
  
  // ==================== delete country record ====================//
  const deleteCountry = catchAsync(async (req, res) => {
    const { _id } = req.body;
    const isExist = await generalService.getRecord("User", { countryId: _id });
    const isExistInCity = await generalService.getRecord("City", {
      countryId: _id,
    });
    if (
      (isExist && isExist.length > 0) ||
      (isExistInCity && isExistInCity.length > 0)
    ) {
      throw new AppError("Record can not deleted because its in use", 409);
    } else {
      const deletedRecord = await generalService.deleteRecord(TableName, {
        _id: _id,
      });
      const countryRecord = await generalService.getRecordAggregateWithSpecific(
        TableName,
        { _id: 1, countryName: 1 },
        { countryName: 1 }
      );
      await client.set(cacheKey, JSON.stringify(countryRecord));
      const Record = await fetchCountryList({}, {});
      res.send({
        status: constant.SUCCESS,
        message: "Record deleted successfully",
        Record: {
          tableData: [{ _id: _id }],
          total: Record[0].total,
        },
      });
    }
  });
  
  // ==================== get country name record ====================//
  const getCountryName = catchAsync(async (req, res) => {
    const cacheResults = await client.get(cacheKey);
    if (cacheResults) {
      console.log("========  Cache Hit ==============");
      res.send({
        status: constant.SUCCESS,
        message: "Record fetch Successfully",
        Record: JSON.parse(cacheResults),
      });
    } else {
      console.log("========  Cache Miss ==============");
      const Record = await generalService.getRecordAggregateWithSpecific(
        TableName,
        { _id: 1, countryName: 1 },
        { countryName: 1 }
      );
      await client.set(cacheKey, JSON.stringify(Record));
      res.send({
        status: constant.SUCCESS,
        message: "Record fetch Successfully",
        Record,
      });
    }
  });
  
  module.exports = {
    addCountry,
    getCountry,
    updateCountry,
    deleteCountry,
    getCountryName,
  };