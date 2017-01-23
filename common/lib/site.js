function Site(data) {
  this.id = data.id;
  this.name = data.name;
  this.url = data.url;
  this.createdDate = data.createdDate;
  this.checkTime = data.checkTime;
  this.checkInterval = data.checkInterval;
}

module.exports = Site;
