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
const alert = new AlertPopup();
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
    alert.show(
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
      // id, category, hazard, location, date, photos, comment, settings,flagged_count, not_there_count,still_there_count
      let hazardReport = new MyReportCard({
        id: report.id,
        category: report.hazardCategory.name,
        hazard: report.hazard.name,
        location: report.location.address,
        date: report.created_at,
        photos: report.images,
        comment: report.comment,
        settings: report.hazardCategory.settings,
        flagged_count: report.flagged_count,
        not_there_count: report.not_there_count,
        still_there_count: report.still_there_count,
      });
      recentReports.appendChild(hazardReport.reportContent());

      document.querySelectorAll('[id^=ts]').forEach((toggleSwitch) => {
        toggleSwitch.addEventListener('change', (e) => {
          onToggle(e);
          // TODO: API call
        });
      });

      loadIcons();
    }
  }
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
    alert.show(
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
        date: report.created_at,
        photos: report.images,
        comment: report.comment,
        settings: report.hazardCategory.settings,
        flagged_count: report.flagged_count,
        not_there_count: report.not_there_count,
        still_there_count: report.still_there_count,
      });
      olderReports.appendChild(hazardReport.reportContent());
      loadIcons();
    }
  }
  olderReportClicked = true;
}
