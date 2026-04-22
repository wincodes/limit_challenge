import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SubmissionsPage from '../submissions/page';

const mockReplace = jest.fn();
const mockUseSubmissionsList = jest.fn();
const mockUseBrokerOptions = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => '/submissions',
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('@/lib/hooks/useSubmissions', () => ({
  useSubmissionsList: (filters: unknown) => mockUseSubmissionsList(filters),
}));

jest.mock('@/lib/hooks/useBrokerOptions', () => ({
  useBrokerOptions: () => mockUseBrokerOptions(),
}));

const listData = {
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      id: 7,
      status: 'new',
      priority: 'high',
      summary: 'Short summary',
      createdAt: '2026-04-20T17:47:49.097889Z',
      updatedAt: '2026-04-20T17:47:49.097892Z',
      broker: {
        id: 3,
        name: 'Summit Brokerage',
        primaryContactEmail: 'broker@example.com',
      },
      company: {
        id: 5,
        legalName: 'Acme Holdings',
        industry: 'Logistics',
        headquartersCity: 'Austin',
      },
      owner: {
        id: 2,
        fullName: 'Jamie Carter',
        email: 'jamie@example.com',
      },
      documentCount: 4,
      noteCount: 2,
      latestNote: null,
    },
  ],
};

describe('SubmissionsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, '', '/submissions');

    mockUseBrokerOptions.mockReturnValue({
      data: [{ id: 3, name: 'Summit Brokerage' }],
      isError: false,
    });

    mockUseSubmissionsList.mockReturnValue({
      data: listData,
      isLoading: false,
      isError: false,
    });
  });

  it('shows loading state while submissions are fetching', () => {
    mockUseSubmissionsList.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<SubmissionsPage />);

    expect(screen.getByText('Loading submissions...')).toBeInTheDocument();
  });

  it('renders submission cards from API data', () => {
    render(<SubmissionsPage />);

    expect(screen.getByText('Acme Holdings')).toBeInTheDocument();
    expect(screen.getByText('Displaying 1 of 1 submissions')).toBeInTheDocument();
    expect(screen.getByText('View details')).toBeInTheDocument();
  });

  it('clears all filters when "Clear Filters" is clicked', async () => {
    window.history.pushState(
      {},
      '',
      '/submissions?status=new&brokerId=3&companySearch=Acme&createdFrom=2026-04-01&createdTo=2026-04-20&hasDocuments=true&hasNotes=false&page=2',
    );

    const user = userEvent.setup();
    render(<SubmissionsPage />);

    await user.click(screen.getByRole('button', { name: 'Clear Filters' }));

    await waitFor(() => {
      const lastCall = mockUseSubmissionsList.mock.calls.at(-1)?.[0];
      expect(lastCall).toEqual(
        expect.objectContaining({
          status: undefined,
          brokerId: undefined,
          companySearch: undefined,
          createdFrom: undefined,
          createdTo: undefined,
          hasDocuments: undefined,
          hasNotes: undefined,
        }),
      );
    });
  });
});
