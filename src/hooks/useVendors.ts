import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Vendor = Database['public']['Tables']['vendors']['Row'];
type VendorInsert = Database['public']['Tables']['vendors']['Insert'];
type VendorUpdate = Database['public']['Tables']['vendors']['Update'];

type VendorContact = Database['public']['Tables']['vendor_contacts']['Row'];
type VendorContactInsert = Database['public']['Tables']['vendor_contacts']['Insert'];
type VendorContactUpdate = Database['public']['Tables']['vendor_contacts']['Update'];

export const useVendors = () => {
  const queryClient = useQueryClient();

  // Vendors
  const { data: vendors = [], isLoading: vendorsLoading, error: vendorsError } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase.from('vendors').select('*');
      if (error) throw error;
      return data as Vendor[];
    }
  });

  // Add Vendor
  const addVendor = useMutation({
    mutationFn: async (vendor: VendorInsert) => {
      const { data, error } = await supabase.from('vendors').insert(vendor).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] })
  });

  // Update Vendor
  const updateVendor = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: VendorUpdate }) => {
      const { data, error } = await supabase.from('vendors').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendors'] })
  });

  // Get Vendor by ID
  const getVendorById = (id: string) => {
    return vendors.find(vendor => vendor.id === id) || null;
  };

  // Get Vendors by Status
  const getVendorsByStatus = (status: string) => {
    return vendors.filter(vendor => vendor.status === status);
  };

  // Vendor Contacts
  const { data: contacts = [], isLoading: contactsLoading, error: contactsError } = useQuery({
    queryKey: ['vendor-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('vendor_contacts').select('*');
      if (error) throw error;
      return data as VendorContact[];
    }
  });

  // Add Contact
  const addContact = useMutation({
    mutationFn: async (contact: VendorContactInsert) => {
      const { data, error } = await supabase.from('vendor_contacts').insert(contact).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendor-contacts'] })
  });

  // Update Contact
  const updateContact = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: VendorContactUpdate }) => {
      const { data, error } = await supabase.from('vendor_contacts').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendor-contacts'] })
  });

  // Get Contacts by Vendor
  const getContactsByVendor = (vendorId: string) => {
    return contacts.filter(contact => contact.vendor_id === vendorId);
  };

  // Get Primary Contact
  const getPrimaryContact = (vendorId: string) => {
    return contacts.find(contact => contact.vendor_id === vendorId && contact.is_primary) || null;
  };

  return {
    vendors,
    contacts,
    isLoading: vendorsLoading || contactsLoading,
    error: vendorsError || contactsError,
    addVendor,
    updateVendor,
    getVendorById,
    getVendorsByStatus,
    addContact,
    updateContact,
    getContactsByVendor,
    getPrimaryContact
  };
}; 