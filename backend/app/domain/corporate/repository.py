from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID
from app.domain.corporate.entities import OrganisationEntity, DepartmentEntity, CostCentreEntity, TravelPolicyEntity

class CorporateRepositoryInterface(ABC):
    @abstractmethod
    async def get_organisation_by_id(self, org_id: UUID) -> Optional[OrganisationEntity]:
        """Retrieve organization details."""
        pass

    @abstractmethod
    async def create_organisation(self, org: OrganisationEntity) -> OrganisationEntity:
        """Create a new corporate organization."""
        pass

    @abstractmethod
    async def add_department(self, dept: DepartmentEntity) -> DepartmentEntity:
        """Add a department to an organization."""
        pass

    @abstractmethod
    async def add_cost_centre(self, cost_centre: CostCentreEntity) -> CostCentreEntity:
        """Create a cost center for a department."""
        pass

    @abstractmethod
    async def set_travel_policy(self, policy: TravelPolicyEntity) -> TravelPolicyEntity:
        """Configure travel policy parameters."""
        pass
