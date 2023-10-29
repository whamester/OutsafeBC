import { API_URL } from '../../constants.js'
// Helpers
import MyReport from '../../assets/components/ReportCard.js'
import { getUserSession } from '../../assets/helpers/storage.js'
// Components
import AlertPopup from '../../assets/components/AlertPopup.js'
import loadIcons from '../../assets/helpers/load-icons.js'

// Variables
const user = getUserSession()
let userID = user?.id
let recentReportArr = []
let olderReportArr = []
let olderReportClicked = false
const recentReports = document.getElementById('recentReports')
const olderReports = document.getElementById('olderReports')
const recentBtn = document.getElementById('recentReportsBtn')
const olderBtn = document.getElementById('olderReportsBtn')
const alert = new AlertPopup()

// Checkbox toggle
// Set the recentBtn to be checked initially
recentBtn.checked = true
displayRecentReports()

recentBtn.addEventListener('click', () => {
	recentReports.style.display = 'block'
	olderReports.style.display = 'none'
})
olderBtn.addEventListener('click', () => {
	if (!olderReportClicked) {
		displayOlderReports()
		recentReports.style.display = 'none'
		olderReports.style.display = 'block'
	} else {
		recentReports.style.display = 'none'
		olderReports.style.display = 'block'
	}
})

// Get all the recent reports for the logged in user and display them

// TODO: handle pagination
async function getRecentReports() {
	try {
		recentReportArr.splice(0, recentReportArr.length)

		const response = await fetch(
			`${API_URL}/hazard-report?cursor=20&size=40&user_id=${userID}&type=recent`
		)
		const result = await response.json()

		recentReportArr.push(...result.data.results)
	} catch (error) {
		alert.show(
			'Reports unavailable at the moment, please try again later or contact support',
			AlertPopup.error
		)
	}
}

async function displayRecentReports() {
	await getRecentReports()

	for (const report of recentReportArr) {
		let hazardReport = new MyReport(
			report.id,
			report.hazardCategory.name,
			report.hazard.name,
			report.location.address,
			report.created_at,
			report.images,
			report.comment
		)
		recentReports.appendChild(hazardReport.reportContent())
		loadIcons()
	}
}

// Get all the older reports for the logged in user and display them
async function getOlderReports() {
	try {
		olderReportArr.splice(0, olderReportArr.length)

		const response = await fetch(
			`${API_URL}/hazard-report?cursor=20&size=40&user_id=${userID}&type=past`
		)
		const result = await response.json()

		olderReportArr.push(...result.data.results)
	} catch (error) {
		alert.show(
			'Reports unavailable at the moment, please try again later or contact support',
			AlertPopup.error
		)
	}
}

async function displayOlderReports() {
	await getOlderReports()

	for (const report of olderReportArr) {
		let hazardReport = new MyReport(
			report.id,
			report.hazardCategory.name,
			report.hazard.name,
			report.location.address,
			report.created_at,
			report.images,
			report.comment
		)
		olderReports.appendChild(hazardReport.reportContent())
		loadIcons()
	}
	olderReportClicked = true
}
