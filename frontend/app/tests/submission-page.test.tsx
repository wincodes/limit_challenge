import { render, screen } from '@testing-library/react';

import SubmissionDetailPage from '../submissions/[id]/page';

const mockUseSubmissionDetail = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '3' }),
}));

jest.mock('@/lib/hooks/useSubmissions', () => ({
  useSubmissionDetail: (id: string | number) => mockUseSubmissionDetail(id),
}));

const detailData = {
  id: 3,
  status: 'lost',
  priority: 'low',
  summary: 'Detailed summary for this submission.',
  createdAt: '2026-04-20T17:47:49.097889Z',
  updatedAt: '2026-04-20T17:47:49.097892Z',
  broker: {
    id: 5,
    name: 'Hamilton, Hayes and Wright Brokerage',
    primaryContactEmail: 'twood@king.biz',
  },
  company: {
    id: 3,
    legalName: 'Valencia, Edwards and Torres',
    industry: 'Dance',
    headquartersCity: 'Careymouth',
  },
  owner: {
    id: 1,
    fullName: 'Bethany Lewis',
    email: 'fclark@example.net',
  },
  contacts: [
    {
      id: 7,
      name: 'Ashley Kennedy',
      role: 'Pharmacologist',
      email: 'john21@example.net',
      phone: '001-924-981-2572',
    },
  ],
  documents: [
    {
      id: 6,
      title: 'Diverse high-level open architecture',
      docType: 'Spreadsheet',
      uploadedAt: '2026-04-20T17:47:49.119515Z',
      fileUrl: 'http://lewis.net/',
    },
  ],
  notes: [
    {
      id: 7,
      authorName: 'Tina Marquez',
      body: 'Everybody might all garden. Mr girl just wish open.',
      createdAt: '2026-04-20T17:47:49.120810Z',
    },
  ],
};

describe('SubmissionDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state while detail is fetching', () => {
    mockUseSubmissionDetail.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<SubmissionDetailPage />);

    expect(screen.getByText('Loading submission details...')).toBeInTheDocument();
  });

  it('renders submission detail sections from API response', () => {
    mockUseSubmissionDetail.mockReturnValue({
      data: detailData,
      isLoading: false,
      isError: false,
    });

    render(<SubmissionDetailPage />);

    expect(screen.getByText('Submission detail')).toBeInTheDocument();
    expect(screen.getByText('Valencia, Edwards and Torres')).toBeInTheDocument();
    expect(screen.getByText('Detailed summary for this submission.')).toBeInTheDocument();
    expect(screen.getByText('Ashley Kennedy')).toBeInTheDocument();
    expect(screen.getByText('Diverse high-level open architecture')).toBeInTheDocument();
    expect(screen.getByText('Everybody might all garden. Mr girl just wish open.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to list' })).toHaveAttribute(
      'href',
      '/submissions',
    );
  });

  it('renders empty-state messages when related data is missing', () => {
    mockUseSubmissionDetail.mockReturnValue({
      data: {
        ...detailData,
        contacts: [],
        documents: [],
        notes: [],
      },
      isLoading: false,
      isError: false,
    });

    render(<SubmissionDetailPage />);

    expect(screen.getByText('No contacts available.')).toBeInTheDocument();
    expect(screen.getByText('No documents uploaded.')).toBeInTheDocument();
    expect(screen.getByText('No notes yet.')).toBeInTheDocument();
  });
});
