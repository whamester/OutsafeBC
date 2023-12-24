class ReportsEmpty {
  constructor() {}

  getHTML = () => {
    return `
        <div style="display:flex; flex-direction:column; gap:2rem; justify-content:center; align-items:center; padding-top:3rem; padding-bottom:3rem; width: 100%;">
                <img src="../../assets/img/notifications-empty.svg" style="width:19.13rem; height: 12.15rem"/>
                <div style="display:flex; flex-direction:column; gap:0.75rem; width: 24.625rem">
                        <h2 class="text-center text-heading-2">Looks like you haven't reported any hazards yet.</h2>
                        <p class="text-body-2 text-center" style="color:var(--neutral-600)">Start by reporting a hazard to ensure a safe outdoors experience for everyone!<p>
                </div>
        </div>
        
        `;
  };
}

export default ReportsEmpty;
