import { API_URL } from '../../constants.js';
// Helpers
import MyReportCard from '../../assets/components/MyReportCard.js';
import { getUserSession } from '../../assets/helpers/storage.js';
import loadIcons from '../../assets/helpers/load-icons.js';
import injectHeader from '../../assets/helpers/inject-header.js';
// Components
import Header from '../../assets/components/Header.js';
import AlertPopup from '../../assets/components/AlertPopup.js';
import { onToggle } from '../../assets/components/ToggleSwitch.js';
import ReportsEmpty from '../../assets/components/ReportsEmpty.js';

// Variables
const user = getUserSession();
let userID = user?.id;
let recentReportArr = [];
let olderReportArr = [];
let olderReportClicked = false;
const recentReports = document.getElementById('recentReports');
const olderReports = document.getElementById('olderReports');
const recentBtn = document.getElementById('recentReportsBtn');
const olderBtn = document.getElementById('olderReportsBtn');

const empty = new ReportsEmpty();

/**
 * Page Init
 */
window.onload = function () {
  // Inject Header
  injectHeader([
    { func: Header, target: '#myReportsBody', position: 'afterbegin' },
  ]);

  // Checkbox toggle
  // Set the recentBtn to be checked initially
  recentBtn.checked = true;
  displayRecentReports();
};

recentBtn.addEventListener('click', () => {
  recentReports.style.display = 'flex';
  olderReports.style.display = 'none';
});
olderBtn.addEventListener('click', () => {
  if (!olderReportClicked) {
    displayOlderReports();
    recentReports.style.display = 'none';
    olderReports.style.display = 'flex';
  } else {
    recentReports.style.display = 'none';
    olderReports.style.display = 'flex';
  }
});

// Get all the recent reports for the logged in user and display them

// TODO: handle pagination
async function getRecentReports() {
  try {
    recentReportArr.splice(0, recentReportArr.length);

    const response = await fetch(
      `${API_URL}/hazard-report?user_id=${userID}&type=recent`
    );
    // TODO: Pagination
    const result = await response.json();

    recentReportArr.push(...result.data.results);
  } catch (error) {
    AlertPopup.show(
      'Reports unavailable at the moment, please try again later or contact support',
      AlertPopup.error
    );
  }
}

async function displayRecentReports() {
  await getRecentReports();
  if (recentReportArr.length < 1) {
    recentReports.innerHTML = empty.getHTML();
  } else {
    for (const report of recentReportArr) {
      let hazardReport = new MyReportCard({
        id: report.id,
        category: report.hazardCategory.name,
        hazard: report.hazard.name,
        location: report.location.address,
        photos: report.images,
        comment: report.comment,
        settings: report.hazardCategory.settings,
        flagged_count: report.flagged_count,
        not_there_count: report.not_there_count,
        still_there_count: report.still_there_count,
        created_at: report.created_at,
        deleted_at: report.deleted_at,
        updated_at: report.updated_at,
      });
      recentReports.appendChild(hazardReport.reportContent());

      loadIcons();
    }
  }
  toggleSwitchEventlistener();
}

// Get all the older reports for the logged in user and display them
async function getOlderReports() {
  try {
    olderReportArr.splice(0, olderReportArr.length);

    const response = await fetch(
      `${API_URL}/hazard-report?user_id=${userID}&type=past`
    );
    // TODO: pagination
    const result = await response.json();

    olderReportArr.push(...result.data.results);
  } catch (error) {
    AlertPopup.show(
      'Reports unavailable at the moment, please try again later or contact support',
      AlertPopup.error
    );
  }
}

async function displayOlderReports() {
  await getOlderReports();

  if (olderReportArr.length < 1) {
    olderReports.innerHTML = empty.getHTML();
  } else {
    for (const report of olderReportArr) {
      // id, category, hazard, location, date, photos, comment, settings,flagged_count, not_there_count,still_there_count
      let hazardReport = new MyReportCard({
        id: report.id,
        category: report.hazardCategory.name,
        hazard: report.hazard.name,
        location: report.location.address,

        photos: report.images,
        comment: report.comment,
        settings: report.hazardCategory.settings,
        flagged_count: report.flagged_count,
        not_there_count: report.not_there_count,
        still_there_count: report.still_there_count,

        created_at: report.created_at,
        deleted_at: report.deleted_at,
        updated_at: report.updated_at,
      });
      olderReports.appendChild(hazardReport.reportContent());

      loadIcons();
    }
    toggleSwitchEventlistener();
  }
  olderReportClicked = true;
}

// Toggle switch eventlistener
function toggleSwitchEventlistener() {
  document.querySelectorAll('[id^=ts]').forEach((toggleSwitch) => {
    toggleSwitch.onchange = (e) => {
      onToggle(e);
      let reportID = e.target.id.slice(3);
      let toggleState = e.target.checked;
      updateReportStatus(reportID, toggleState);
    };
  });
}

// Update status of hazard report
async function updateReportStatus(reportID, activeState) {
  try {
    const response = await fetch(
      `${API_URL}/hazard-report-status?id=${reportID}&is_active=${activeState}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const { error, message } = await response.json();

    if (!!error) {
      AlertPopup.show(`${error}`, AlertPopup.error);
      if (!activeState) {
        // TODO: checked true
      } else {
        // TODO: checked false
      }
    } else {
      AlertPopup.show(`${message}`, AlertPopup.success);
    }
  } catch (error) {
    AlertPopup.show('Unable to update status at the moment', AlertPopup.error);
    if (!activeState) {
      // TODO: checked true
    } else {
      // TODO: checked false
    }
  }
}
