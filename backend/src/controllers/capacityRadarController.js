const capacityRadarService = require('../services/capacityRadarService');
const response = require('../utils/response');

const getOrganizationalRadar = async (req, res, next) => {
  try {
    const data = await capacityRadarService.getOrganizationalRadar();
    return response.success(res, data, 'Organizational Capacity Radar data retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const getDepartmentRadar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await capacityRadarService.getDepartmentRadar(id);
    return response.success(res, data, 'Department Capacity Radar data retrieved', 200);
  } catch (error) {
    next(error);
  }
};

const calculateImpact = async (req, res, next) => {
  try {
    const data = await capacityRadarService.calculateTrainingROI(req.body);
    return response.success(res, data, 'Training ROI calculated', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrganizationalRadar,
  getDepartmentRadar,
  calculateImpact,
};
