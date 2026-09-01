const CapacityRadar = require('../models/CapacityRadar');

class CapacityRadarService {
  async getOrganizationalRadar() {
    return CapacityRadar.getOrganizationalRadar();
  }

  async getDepartmentRadar(departmentId) {
    return CapacityRadar.getDepartmentRadar(departmentId);
  }

  async calculateTrainingROI({ traineesCount = 20, trainingCost = 5000, avgHourlyRate = 45, hoursSavedPerMonth = 15 }) {
    const monthlyProductivityGain = traineesCount * hoursSavedPerMonth * avgHourlyRate;
    const annualProductivityGain = monthlyProductivityGain * 12;
    const netReturn = annualProductivityGain - trainingCost;
    const roiPercentage = Math.round((netReturn / Math.max(trainingCost, 1)) * 100);

    return {
      traineesCount,
      trainingCost,
      monthlyProductivityGain,
      annualProductivityGain,
      netReturn,
      roiPercentage,
      paybackPeriodMonths: (trainingCost / Math.max(monthlyProductivityGain, 1)).toFixed(1),
    };
  }
}

module.exports = new CapacityRadarService();
