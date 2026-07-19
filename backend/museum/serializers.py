from rest_framework import serializers

from .models import Artwork, Tag


class ArtworkSerializer(serializers.ModelSerializer):
    # Tags are exposed as a simple list of names, e.g. ["eyes", "lighting"].
    # On write we accept the same shape and turn names into Tag rows.
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        write_only=True,  # read side is handled in to_representation() below
    )

    class Meta:
        model = Artwork
        fields = [
            "id", "image", "artist", "platform",
            "source_url", "note", "tags", "created_at",
        ]

    def create(self, validated_data):
        tag_names = validated_data.pop("tags", [])
        artwork = Artwork.objects.create(**validated_data)
        self._set_tags(artwork, tag_names)
        return artwork

    def update(self, instance, validated_data):
        tag_names = validated_data.pop("tags", None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        if tag_names is not None:  # only touch tags if the client sent them
            self._set_tags(instance, tag_names)
        return instance

    def _set_tags(self, artwork, names):
        tags = [
            Tag.objects.get_or_create(name=n.strip())[0]
            for n in names if n.strip()
        ]
        artwork.tags.set(tags)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["tags"] = [tag.name for tag in instance.tags.all()]
        return data
