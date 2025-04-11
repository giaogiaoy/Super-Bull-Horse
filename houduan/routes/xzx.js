var express = require("express");
var router = express.Router();
var {
  CAModel,
  peopleModel,
  ReportModel,
  TravelrecordModel,
  juesemodel,
  luyoumodel,
  yonghumodel,
} = require("../MGdb/mgdb");
const path = require("path");
const fs = require("fs-extra");
const multer = require("multer");
const crypto = require("crypto");
var multiparty = require("multiparty");
var xlsx = require("node-xlsx").default;
const jwt = require("jsonwebtoken");
const moment = require('moment');
router.get("/travelrecord", async (req, res, next) => {
  let page = req.query.page;
  let pageSize = req.query.pageSize;
  let name = req.query.name;
  let start = req.query.startTime;
  let end = req.query.endTime;
  let sou = {};
  if (name) {
    sou.name = new RegExp(name);
  }
  if (start && end) {
    sou.time = {
        $gte: moment(start).format('YYYY-MM-DD 00:00:00'),
        $lte: moment(end).format('YYYY-MM-DD 23:59:59')
    };
  }
  let data = await TravelrecordModel.find(sou)
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  let total = await TravelrecordModel.find(sou).countDocuments();
  res.send({
    code: 200,
    data: data,
    total: total,
  });
});
//查看详情
router.get("/xq", async (req, res) => {
  let id = req.query.id;
  let data = await TravelrecordModel.find({ _id: id });
  res.send({
    code: 200,
    data: data,
  });
});

module.exports = router;
