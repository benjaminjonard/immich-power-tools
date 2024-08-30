import ErrorBlock from "@/components/shared/ErrorBlock";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";
import { searchPlaces } from "@/handlers/api/common.handler";
import { cn } from "@/lib/utils";
import { IPlace } from "@/types/common";
import clsx from "clsx";
import { Check } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";

interface TagMissingLocationSearchLatLongProps {
  onSubmit: (place: IPlace) => Promise<any>;
  onOpenChange: (open: boolean) => void;
}
export default function TagMissingLocationSearchLatLong(
  {
    onSubmit,
    onOpenChange
  }: TagMissingLocationSearchLatLongProps
) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<IPlace>({
    latitude: 0,
    longitude: 0,
    name: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(() => {
    if (formData.latitude === 0 || formData.longitude === 0) {
      return false;
    }
    if (isNaN(formData.latitude) || isNaN(formData.longitude)) {
      return false;
    }
    return true;
  }, [formData]);

  const handleChange = (key: string, value: string) => {
    if (value.includes(",")) {
      const latLong = value.split(",");
      if (latLong.length === 2) {
        setFormData({
          ...formData,
          latitude: parseFloat(latLong[0]),
          longitude: parseFloat(latLong[1]),
        });
      }
    } else {

      setFormData({
        ...formData,
        [key]: value,
      });
    }
  }

  const handleSubmit = () => {
    if (!isValid) {
      return;
    }

    setSubmitting(true);
    onSubmit(formData)
      .then(() => {
        toast({
          title: "Location updated",
          description: "Location updated successfully",
        });
      })
      .then(() => {
        onOpenChange(false);
        setFormData({
          latitude: 0,
          longitude: 0,
          name: "",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Error updating location",
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };


  return (
    <div className="flex flex-col gap-4 py-4 px-2">
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-2">
          <Label>Latitude</Label>
          <Input
            placeholder="Latitude"
            value={formData.latitude}
            onChange={(e) => {
              handleChange("latitude", e.target.value);
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>
            Longitude
          </Label>
          <Input
            placeholder="Longitude"
            value={formData.longitude}
            onChange={(e) => {
              handleChange("longitude", e.target.value);
            }}
          />
        </div>
      </div>
      
      <div className="self-end">
        <Button
          variant="outline"
          onClick={handleSubmit}
          disabled={!isValid || submitting}
        >
          {submitting ? ("Adding...") : ("Add New Location")}
        </Button>
      </div>
    </div>
  )
}
