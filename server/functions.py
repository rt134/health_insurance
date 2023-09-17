from models import Cart, InsurancePlan

# Base premium calculation Logic => To be replaced by High precision ML model
def calculate_base_premium(age, city_tier, sum_insured, tenure):
    premium = 0
    if city_tier == 'Tier-1':
        premium = age * 1.5 * int(tenure) * int(sum_insured)/1000
    else:
        premium = age * int(tenure) * int(sum_insured)/1000

    return premium

# Discount and Final Premium calculation 
def calculate_total_premium(insured_members):

    insured_members.sort(key=lambda x: -x.age)
    total_premium = 0.0

    for index, member in enumerate(insured_members):
        if index == 0:
            total_premium += member.base_premium
        else:
            member.discount = 50
            total_premium += 0.5 * member.base_premium
            member.save()

    return total_premium

# Cleaning Up old member instances
def clean_up_old_instances(user):
    
    try:
        inactive_plans = InsurancePlan.objects(user=user, status=False)
        for plan in inactive_plans:

            for member in plan.insured_members:
                member.delete()

            plan.delete()
            return True
    except Exception as e:
        return False