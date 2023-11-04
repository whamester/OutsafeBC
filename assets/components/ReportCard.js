import ReportCard from '../helpers/card-container.js';
import ToggleSwitch from '../components/ToggleSwitch.js';

class MyReportCard extends ReportCard {
  constructor(id, category, hazard, location, date, photos, comment, icon) {
    super(id, category, hazard, location, date, photos, comment, icon);
  }

  reportContent() {
    const dateObj = new Date(this.date);
    const date = dateObj.toLocaleString('default', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const time = dateObj.toLocaleTimeString('default', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });

    let photos = this.photos;
    let gallery = document.createElement('div');
    gallery.setAttribute('id', 'report-card__picture-container');

    for (const pic of photos) {
      let image = document.createElement('img');
      image.src = pic;
      gallery.appendChild(image);
    }

    let divOuter = document.createElement('div');
    divOuter.setAttribute('id', `reportCard${this.id}`);
    divOuter.setAttribute('class', `report-card__outer`);
    let divInner = document.createElement('div');
    divInner.setAttribute('class', `report-card__inner`);
    divInner.innerHTML = `
		<div class="report-card__heading">
			<span class="btn__icon report-card__heading__icon" style="background-color: ${
        this.settings.iconBackround
      }">
				<i class="${
          this.settings.icon
        }" style="width:24px; height:24px; background-color: white"></i>
			</span>
        	<p class="text-body-1 semibold">${this.hazard}</p>
		</div>

		<div class="report-card__top-info">
			<div class="report-card__location">
				<i class="icon-location-pin-outline" style="background-color: var(--neutral-400)"></i>
				<p class="text-body-2 regular">${this.location}</p>
			</div>

			<div class="report-card__date_time">
				<div class="report-card__date">
					<i class="icon-date" style="background-color: var(--neutral-400)"></i>
					<p class="text-body-2 regular">${date}</p>
				</div>

				<div class="report-card__time">
					<i class="icon-time" style="background-color: var(--neutral-400)"></i>
					<p class="text-body-2 regular">${time}</p>
				</div>
			</div>
		</div>

		<div class="report-card__spacer-line"></div>
				
		<div id="report-card__image-gallery"></div>

		<div class="report-card__spacer-line"></div>

		<p class="text-body-3 regular">Description</p>
		<p class="text-body-2 regular">${this.comment}</p>

		<div class="report-card__spacer-line"></div>

		<div class="report-card__my-reports-buttons">
			${ToggleSwitch(this.id)}
			<button class="btn btn-tertiary text-body-3 medium" onclick="window.location.href='/pages/report-hazard/index.html?id=${
        this.id
      }'">
				<i class="icon-edit"></i>
				Edit Report
			</button>
		</div>
        `;
    divInner.querySelector('#report-card__image-gallery').appendChild(gallery);
    divOuter.appendChild(divInner);
    return divOuter;
  }
}

export default MyReportCard;
