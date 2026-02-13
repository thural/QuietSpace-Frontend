/**
 * Table Component Styles - Enterprise Styled-Components
 */

import styled from 'styled-components';
import { EnhancedTheme } from '../../../../core/modules/theming';

export const TableContainer = styled.div`
  width: 100%;
  background-color: ${(props: any) => props.theme.colors.background.primary};
  border-radius: ${(props: any) => props.theme.radius.md};
  border: ${(props: any) => props.theme.colors.border.light};
  overflow: hidden;
  box-shadow: ${(props: any) => props.theme.shadows.sm};
`;

export const TableHeader = styled.thead`
  background-color: ${(props: any) => props.theme.colors.background.secondary};
  border-bottom: ${(props: any) => props.theme.colors.border.light};
`;

export const TableHeaderCell = styled.th`
  padding: ${(props: any) => props.theme.spacing.sm};
  font-weight: ${(props: any) => props.theme.typography.fontWeight.medium};
  color: ${(props: any) => props.theme.colors.text.primary};
  border-bottom: ${(props: any) => props.theme.colors.border.light};
  background-color: ${(props: any) => props.theme.colors.background.secondary};
`;

export const TableBody = styled.tbody`
  .table-row {
    border-bottom: ${(props: any) => props.theme.colors.border.light};
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${(props: any) => props.theme.colors.background.secondary};
    }

    &.selected {
      background-color: ${(props: any) => props.theme.colors.brand[50]};
      border-color: ${(props: any) => props.theme.colors.brand[200]};
    }
  }
`;

export const TableRow = styled.tr`
  border-bottom: ${(props: any) => props.theme.colors.border.light};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props: any) => props.theme.colors.background.secondary};
  }
`;

export const TableCell = styled.td`
  padding: ${(props: any) => props.theme.spacing.sm};
  color: ${(props: any) => props.theme.colors.text.primary};
  border-bottom: ${(props: any) => props.theme.colors.border.light};

  &:last-child {
    border-bottom: none;
  }
`;

export const TablePagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props: any) => props.theme.spacing.md};
  border-top: ${(props: any) => props.theme.colors.border.light};
  background-color: ${(props: any) => props.theme.colors.background.secondary};
`;

export const SortIndicator = styled.span`
  margin-left: ${(props: any) => props.theme.spacing.xs};
  font-size: ${(props: any) => props.theme.typography.fontSize.sm};
  color: ${(props: any) => props.theme.colors.brand[500]};
`;

// Legacy export for backward compatibility
export const TableStyles = {
  container: TableContainer,
  header: TableHeader,
  headerCell: TableHeaderCell,
  body: TableBody,
  row: TableRow,
  cell: TableCell,
  pagination: TablePagination,
  sortIndicator: SortIndicator,
};

export default TableStyles;
