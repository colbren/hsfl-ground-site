import requests

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


REMOTE_URL = (
    "http://192.168.150.110:8000/api/scheduled-passes/"
)


@api_view(["GET"])
def remote_scheduled_passes(request):

    try:

        response = requests.get(
            REMOTE_URL,
            timeout=5,
        )

        return Response(
            response.json(),
            status=response.status_code,
        )

    except Exception as e:

        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )