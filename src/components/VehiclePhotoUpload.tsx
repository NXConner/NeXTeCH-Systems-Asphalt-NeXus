import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Upload, Image, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VehiclePhoto {
  id: string;
  vehicle_id: string;
  photo_url: string;
  description: string | null;
  photo_type: 'general' | 'damage' | 'maintenance' | 'inspection';
  uploaded_at: string;
  uploaded_by: string | null;
}

interface VehiclePhotoUploadProps {
  vehicleId: string;
}

export const VehiclePhotoUpload = ({ vehicleId }: VehiclePhotoUploadProps) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: photos, isLoading } = useQuery({
    queryKey: ['vehicle-photos', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_photos')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      return data as VehiclePhoto[];
    }
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: async ({ file, photoData }: { file: File; photoData: Partial<VehiclePhoto> }) => {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${vehicleId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicle-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('vehicle-photos')
        .getPublicUrl(filePath);

      // Save photo record to database
      const { data, error } = await supabase
        .from('vehicle_photos')
        .insert({
          vehicle_id: vehicleId,
          photo_url: urlData.publicUrl,
          description: photoData.description || null,
          photo_type: photoData.photo_type || 'general',
          uploaded_by: (await supabase.auth.getUser()).data.user?.id || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-photos', vehicleId] });
      setIsUploadOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success("Photo uploaded successfully");
    },
    onError: (error) => {
      toast.error("Failed to upload photo: " + error.message);
    }
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      const { error } = await supabase
        .from('vehicle_photos')
        .delete()
        .eq('id', photoId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-photos', vehicleId] });
      toast.success("Photo deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete photo: " + error.message);
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async (formData: FormData) => {
    if (!selectedFile) return;

    const photoData = {
      description: formData.get('description') as string,
      photo_type: formData.get('photo_type') as VehiclePhoto['photo_type']
    };

    uploadPhotoMutation.mutate({ file: selectedFile, photoData });
  };

  const capturePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.setAttribute('capture', 'environment');
    input.onchange = (e) => {
      const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    };
    input.click();
  };

  if (isLoading) {
    return <div>Loading photos...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Vehicle Photos
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={capturePhoto}>
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Vehicle Photo</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleUpload(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="photo">Select Photo</Label>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      required
                      title="Upload vehicle photo"
                      placeholder="Choose a photo to upload"
                    />
                  </div>

                  {previewUrl && (
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded border"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="photo_type">Photo Type</Label>
                    <Select name="photo_type" defaultValue="general">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="damage">Damage</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the photo..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={uploadPhotoMutation.isPending || !selectedFile}>
                      {uploadPhotoMutation.isPending ? "Uploading..." : "Upload Photo"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos?.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.photo_url}
                alt={photo.description || 'Vehicle photo'}
                className="w-full h-48 object-cover rounded border"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePhotoMutation.mutate(photo.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm font-medium">{photo.photo_type}</p>
                  {photo.description && (
                    <p className="text-xs">{photo.description}</p>
                  )}
                  <p className="text-xs opacity-75">
                    {new Date(photo.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!photos?.length && (
          <div className="text-center py-8">
            <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No photos uploaded yet</p>
            <p className="text-sm text-muted-foreground">Upload photos to document vehicle condition</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
