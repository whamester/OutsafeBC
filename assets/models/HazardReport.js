import ReportForm from './ReportForm.js';

class HazardReport extends ReportForm {
  constructor() {
    super();

    this.id = null;

    this.category = {
      id: null,
      name: null,
      settings: {
        icon: null,
        iconBackround: null,
        report_hazard_question: null,
      },
    };

    this.created_at = null;
    this.deleted_at = null;
    this.updated_at = null;

    this.flagged_count = 0;
    this.not_there_count = 0;
    this.still_there_count = 0;

    this.user = {
      email: null,
      name: null,
    };
  }
}

export default HazardReport;
