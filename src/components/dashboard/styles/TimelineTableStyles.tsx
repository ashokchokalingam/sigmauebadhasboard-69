
export const tableStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  
  .custom-table {
    font-family: 'Inter', sans-serif;
  }
  
  .description-text {
    color: #94A3B8;
    line-height: 1.6;
  }

  .header-gradient {
    background: linear-gradient(to right, #1E293B, #151823);
  }

  .expanded-row {
    background: linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(30, 41, 59, 0.2) 100%);
    backdrop-filter: blur(12px);
  }

  .detail-card {
    background: rgba(30, 41, 59, 0.5);
    border: 1px solid rgba(99, 102, 241, 0.1);
    border-radius: 0.5rem;
  }

  .detail-header {
    color: #818CF8;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .detail-value {
    color: #E2E8F0;
    font-size: 0.875rem;
  }
`;
