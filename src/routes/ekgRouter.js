module.exports = (app) => {
  /**
   * Just an EKG route to ensure API is up and running
   */
  app.get('api/v1/ekg', (req, res) => {
    res.status(200).json({status: 'Active'});
  })
}