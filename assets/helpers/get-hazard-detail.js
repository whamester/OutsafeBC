import HazardReport from '../models/HazardReport.js';
import apiRequest from './api-request.js';

const getHazardDetail = async (idReport) => {
  const hazardDetail = new HazardReport();

  try {
    if (idReport && idReport.trim() !== '') {
      const { data, error } = await apiRequest(`hazard-report?id=${idReport}`);

      if (error) {
        const alert = new AlertPopup();
        alert.show(error, AlertPopup.error, 500);
        return;
      }

      hazardDetail.id = data.id;

      hazardDetail.category = {
        id: data.hazardCategory.id,
        name: data.hazardCategory.name,
        settings: data.hazardCategory.settings,
      };

      hazardDetail.option = {
        id: data.hazard.id,
        name: data.hazard.name,
      };

      hazardDetail.images = data.images;
      hazardDetail.comment = data.comment;
      hazardDetail.created_at = data.created_at;
      hazardDetail.deleted_at = data.deleted_at;
      hazardDetail.updated_at = data.updated_at;
      hazardDetail.flagged_count = data.flagged_count;
      hazardDetail.not_there_count = data.not_there_count;
      hazardDetail.still_there_count = data.still_there_count;

      hazardDetail.user = {
        name: data.user.name,
        email: data.user.email,
      };

      hazardDetail.location = {
        lat: data.location.lat,
        lng: data.location.lng,
        address: data.location.address,
      };
    }
  } catch (error) {
    console.error(error);
  }

  return hazardDetail;
};

export default getHazardDetail;
